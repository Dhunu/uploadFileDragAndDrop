"use client";

import { FileType } from "@/typings";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DataTable } from "./table";
import { columns } from "./columns";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { Skeleton } from "../ui/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";

const TableWrapper = ({ skeletonFiles }: { skeletonFiles: FileType[] }) => {
    const { user } = useUser();
    const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
    const [sort, setSort] = useState<"asc" | "desc">("desc");

    const [docs, loading, error] = useCollection(
        user &&
            query(
                collection(db, "users", user.id, "files"),
                orderBy("timestamp", sort)
            )
    );

    useEffect(() => {
        if (!docs) return;
        const files = docs?.docs.map((doc) => ({
            id: doc.id,
            filename: doc.data().filename || doc.id,
            timestamp:
                new Date(doc.data().timestamp?.seconds * 1000) || undefined,
            fullName: doc.data().fullName,
            downloadURL: doc.data().downloadURL,
            type: doc.data().type,
            size: doc.data().size,
        }));

        setInitialFiles(files);
    }, [docs]);

    if (docs?.docs.length === undefined)
        return (
            <div className="flex flex-col">
                <Button variant="outline" className="ml-auto mb-5">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-20" />
                </Button>

                <div className="border rounded-lg">
                    <div className="border-b h-12" />
                    {skeletonFiles.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center space-x-4 p-5 w-full"
                        >
                            <Skeleton className="h-12 w-12" />
                            <Skeleton className="h-4 w-[60%]" />
                        </div>
                    ))}

                    {skeletonFiles.length === 0 && (
                        <div className="flex items-center space-x-4 p-5 w-full">
                            <Skeleton className="h-12 w-12" />
                            <Skeleton className="h-4 w-[60%]" />
                        </div>
                    )}
                </div>
            </div>
        );

    return (
        <div className="flex flex-col space-y-5">
            <Button
                variant="outline"
                onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
                className="ml-auto w-fit"
            >
                {sort === "desc" ? (
                    <ArrowDown className="h-4 w-4 mr-2" />
                ) : (
                    <ArrowUp className="h-4 w-4 mr-2" />
                )}
                Sort by {sort === "desc" ? "Newest" : "Oldest"}
            </Button>

            <div className="rounded-lg border bg-white dark:bg-gray-800">
                <DataTable columns={columns} data={initialFiles} />
            </div>
        </div>
    );
};

export default TableWrapper;
