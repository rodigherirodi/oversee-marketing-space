
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const WorkspaceBreadcrumb = () => {
  const location = useLocation();
  const { activeWorkspace, getCurrentPage } = useWorkspace();
  const currentPage = getCurrentPage(location.pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center gap-2">
            <activeWorkspace.icon className="w-4 h-4" />
            {activeWorkspace.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {currentPage && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <currentPage.icon className="w-4 h-4" />
                {currentPage.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default WorkspaceBreadcrumb;
