import { Request, Response } from 'express';
import Lead from '../models/Lead';
import {
  AuthenticatedRequest,
  ILeadQuery,
  LeadStatus,
  LeadSource,
  SortOrder,
  UserRole,
  IPaginationMeta,
} from '../types';

/**
 * @route   GET /api/leads
 * @desc    Get all leads with filtering, search, sort, and pagination
 * @access  Private
 */
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const {
      status,
      source,
      search,
      sort = SortOrder.LATEST,
      page = 1,
      limit = 10,
    } = req.query as unknown as ILeadQuery;

    // Build filter object
    const filter: Record<string, unknown> = {};

    // Role-based filtering: sales users see only their leads
    if (authReq.user.role === UserRole.SALES) {
      filter.assignedTo = authReq.user.id;
    }

    if (status && Object.values(LeadStatus).includes(status)) {
      filter.status = status;
    }

    if (source && Object.values(LeadSource).includes(source)) {
      filter.source = source;
    }

    // Search by name or email (case-insensitive regex)
    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Sort order
    const sortOrder = sort === SortOrder.OLDEST ? 1 : -1;

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [leads, totalRecords] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('assignedTo', 'name email role')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limitNum);

    const pagination: IPaginationMeta = {
      currentPage: pageNum,
      totalPages,
      totalRecords,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    res.status(200).json({
      success: true,
      message: 'Leads retrieved successfully.',
      data: {
        records: leads,
        pagination,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leads';
    res.status(500).json({ success: false, message });
  }
};

/**
 * @route   GET /api/leads/:id
 * @desc    Get single lead by ID
 * @access  Private
 */
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const filter: Record<string, unknown> = { _id: req.params.id };

    // Sales users can only view their own leads
    if (authReq.user.role === UserRole.SALES) {
      filter.assignedTo = authReq.user.id;
    }

    const lead = await Lead.findOne(filter).populate('assignedTo', 'name email role');

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead retrieved successfully.',
      data: lead,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch lead';
    res.status(500).json({ success: false, message });
  }
};

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 * @access  Private
 */
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      assignedTo: authReq.user.id,
    });

    const populatedLead = await Lead.findById(lead._id).populate(
      'assignedTo',
      'name email role'
    );

    res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: populatedLead,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create lead';
    res.status(500).json({ success: false, message });
  }
};

/**
 * @route   PUT /api/leads/:id
 * @desc    Update a lead
 * @access  Private
 */
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const filter: Record<string, unknown> = { _id: req.params.id };

    // Sales users can only update their own leads
    if (authReq.user.role === UserRole.SALES) {
      filter.assignedTo = authReq.user.id;
    }

    const { name, email, status, source } = req.body;
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (status !== undefined) updateData.status = status;
    if (source !== undefined) updateData.source = source;

    const lead = await Lead.findOneAndUpdate(filter, updateData, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email role');

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found or unauthorized.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: lead,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update lead';
    res.status(500).json({ success: false, message });
  }
};

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead
 * @access  Private (Admin only)
 */
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const filter: Record<string, unknown> = { _id: req.params.id };

    // Sales users can only delete their own leads
    if (authReq.user.role === UserRole.SALES) {
      filter.assignedTo = authReq.user.id;
    }

    const lead = await Lead.findOneAndDelete(filter);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead not found or unauthorized.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete lead';
    res.status(500).json({ success: false, message });
  }
};

/**
 * @route   GET /api/leads/export/csv
 * @desc    Export leads as CSV
 * @access  Private (Admin only)
 */
export const exportLeadsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { status, source, search } = req.query;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (authReq.user.role === UserRole.SALES) {
      filter.assignedTo = authReq.user.id;
    }

    if (status && Object.values(LeadStatus).includes(status as LeadStatus)) {
      filter.status = status;
    }

    if (source && Object.values(LeadSource).includes(source as LeadSource)) {
      filter.source = source;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email')
      .lean();

    // Build CSV manually
    const headers = ['Name', 'Email', 'Status', 'Source', 'Assigned To', 'Created At'];
    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      const assignedTo = lead.assignedTo as unknown as { name: string; email: string } | null;
      const row = [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${assignedTo?.name || 'N/A'}"`,
        `"${new Date(lead.createdAt).toISOString()}"`,
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads_export_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to export leads';
    res.status(500).json({ success: false, message });
  }
};

/**
 * @route   GET /api/leads/stats/overview
 * @desc    Get lead statistics for dashboard
 * @access  Private
 */
export const getLeadStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const matchFilter: Record<string, unknown> = {};
    if (authReq.user.role === UserRole.SALES) {
      matchFilter.assignedTo = authReq.user.id;
    }

    const [totalLeads, statusCounts, sourceCounts, recentLeads] = await Promise.all([
      Lead.countDocuments(matchFilter),
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.find(matchFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignedTo', 'name email')
        .lean(),
    ]);

    const statusMap: Record<string, number> = {};
    statusCounts.forEach((s: { _id: string; count: number }) => {
      statusMap[s._id] = s.count;
    });

    const sourceMap: Record<string, number> = {};
    sourceCounts.forEach((s: { _id: string; count: number }) => {
      sourceMap[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      message: 'Lead statistics retrieved successfully.',
      data: {
        totalLeads,
        byStatus: statusMap,
        bySource: sourceMap,
        recentLeads,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get stats';
    res.status(500).json({ success: false, message });
  }
};
