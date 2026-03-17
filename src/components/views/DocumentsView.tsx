import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useWorkspaces, useDocuments, useDeleteDocument, useDeleteAllDocuments } from "@/hooks/useWorkspaces";
import { toast } from "sonner";

export function DocumentsView() {
  const { data: workspaces = [], isLoading: workspacesLoading } = useWorkspaces();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(
    workspaces && workspaces.length > 0 ? workspaces[0].workspaceId : ""
  );

  const { data: documents = [], isLoading: documentsLoading, refetch } = useDocuments(selectedWorkspace);
  const deleteDocumentMutation = useDeleteDocument();
  const deleteAllMutation = useDeleteAllDocuments();

  const handleDeleteOne = (docId: string, fileName: string) => {
    deleteDocumentMutation.mutate(
      { workspaceId: selectedWorkspace, documentId: docId },
      {
        onSuccess: () => {
          toast.success(`Document "${fileName}" deleted successfully`);
          refetch();
        },
        onError: () => {
          toast.error("Failed to delete document");
        },
      }
    );
  };

  const handleDeleteAll = () => {
    deleteAllMutation.mutate(
      { workspaceId: selectedWorkspace },
      {
        onSuccess: () => {
          const workspaceName = workspaces?.find((w) => w.workspaceId === selectedWorkspace)?.workspaceName || "workspace";
          toast.success(`All documents from "${workspaceName}" deleted successfully`);
          refetch();
        },
        onError: () => {
          toast.error("Failed to delete all documents");
        },
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Documents</h1>
        <p className="text-muted-foreground">
          Manage documents in your workspaces
        </p>
      </div>

      {/* Workspace Selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-foreground">Workspace:</label>
        <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces?.map((workspace) => (
              <SelectItem key={workspace.workspaceId} value={workspace.workspaceId}>
                {workspace.workspaceName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={documentsLoading}
          className="gap-2"
        >
          {documentsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </Button>
        {documents && documents.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all documents?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all documents from{" "}
                  <strong>
                    {workspaces?.find((w) => w.workspaceId === selectedWorkspace)?.workspaceName}
                  </strong>
                  . This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-auto rounded-lg border border-border bg-card">
        {documentsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {doc.fileName}
                    </p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{doc.fileType}</span>
                      <span className="capitalize">{doc.ingestionStatus}</span>
                      <span>{new Date(doc.createdAt || "").toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete{" "}
                        <strong>{doc.fileName}</strong>. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteOne(doc.id, doc.fileName)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-muted-foreground">No documents yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
