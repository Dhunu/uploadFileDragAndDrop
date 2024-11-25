import { COLOR_EXTENSION_MAP } from "@/constants";
import { FileType } from "@/typings";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Eye } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Button } from "../ui/button";

export const columns: ColumnDef<FileType>[] = [
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ renderValue, ...props }) => {
            const type = renderValue() as string;
            const extension: string = type.split("/")[1];
            return (
                <div className="w-10">
                    <FileIcon
                        extension={extension}
                        labelColor={COLOR_EXTENSION_MAP[extension]}
                        // @ts-ignore
                        {...defaultStyles[extension]}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "filename",
        header: "Filename",
        cell: ({ renderValue }) => {
            const filename = renderValue() as string;
            return (
                <div className="flex items-center space-x-2">
                    <span className="truncate max-w-[200px] text-gray-900 dark:text-gray-100">
                        {filename}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "timestamp",
        header: "Date Added",
        cell: ({ renderValue }) => {
            const timestamp = renderValue() as { seconds: number; nanoseconds: number };
            if (!timestamp) return null;
            
            const date = new Date(timestamp.seconds * 1000);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }).format(date);
            
            return (
                <div className="text-gray-600 dark:text-gray-400">
                    {formattedDate}
                </div>
            );
        },
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ renderValue }) => {
            return (
                <div className="text-gray-600 dark:text-gray-400">
                    {prettyBytes(renderValue() as number)}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { downloadURL } = row.original;

            return (
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        asChild
                    >
                        <a 
                            href={downloadURL} 
                            download 
                            className="text-blue-600 dark:text-blue-400"
                        >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                        </a>
                    </Button>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        asChild
                    >
                        <a 
                            href={downloadURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 dark:text-purple-400"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                        </a>
                    </Button>
                </div>
            );
        },
    },
];
