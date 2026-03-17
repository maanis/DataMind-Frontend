import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface Workspace {
  workspaceId: string;
  workspaceName: string;
}

export interface DocumentItem {
  id: string;
  fileName: string;
  fileType: string;
  ingestionStatus: string;
  createdAt?: string;
}

interface CreateWorkspaceRequest {
  workspaceName: string;
}

interface CreateWorkspaceResponse {
  workspace: Workspace;
}

// API functions
const fetchWorkspaces = async (): Promise<Workspace[]> => {
  const response = await fetch(`${API_BASE}/workspace`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const workspaces = data.workspaces || [];

  // Validate and sanitize workspace data
  return workspaces.map((ws: any) => ({
    workspaceId: ws._id || ws.workspaceId || ws.id || 'unknown',
    workspaceName: ws.workspaceName || ws.name || 'Unnamed Workspace'
  }));
};

const createWorkspace = async (workspaceData: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> => {
  const response = await fetch(`${API_BASE}/workspace`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(workspaceData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  // Ensure the response has the correct structure
  return {
    workspace: {
      workspaceId: data.workspace?._id || data.workspace?.workspaceId || data.workspace?.id || 'unknown',
      workspaceName: data.workspace?.workspaceName || data.workspace?.name || workspaceData.workspaceName
    }
  };
};

// API functions for documents
const fetchDocuments = async (workspaceId: string): Promise<DocumentItem[]> => {
  const response = await fetch(`${API_BASE}/workspace/${workspaceId}/documents`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const documents = data.documents || [];

  return documents.map((doc: any) => ({
    id: doc._id || doc.id || 'unknown',
    fileName: doc.fileName || 'Untitled',
    fileType: doc.fileType || 'unknown',
    ingestionStatus: doc.ingestionStatus || 'unknown',
    createdAt: doc.createdAt,
  }));
};

const deleteDocument = async ({ workspaceId, documentId }: { workspaceId: string; documentId: string }) => {
  const response = await fetch(`${API_BASE}/workspace/document`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ workspaceId, documentId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

const deleteAllDocuments = async ({ workspaceId }: { workspaceId: string }) => {
  const response = await fetch(`${API_BASE}/workspace/documents`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ workspaceId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// React Query hooks
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: fetchWorkspaces,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: (data) => {
      // Invalidate and refetch workspaces
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      return data;
    },
  });
};

export const useDocuments = (workspaceId: string) => {
  return useQuery({
    queryKey: ['documents', workspaceId],
    queryFn: () => fetchDocuments(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useDeleteAllDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllDocuments,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};