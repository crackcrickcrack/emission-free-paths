import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, title = 'Error' }) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <CardContent className="p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
              {title}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              {errorMessage}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay; 