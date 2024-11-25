"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "./ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { db, storage } from "@/firebase";
import { addDoc, collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FileIcon, defaultStyles } from "react-file-icon";
import prettyBytes from "pretty-bytes";

const DropzoneComponent = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadingFile, setUploadingFile] = useState<File | null>(null);
    const { isLoaded, isSignedIn, user } = useUser();

    // max size of 50MB accepted
    const maxSize = 52428800;

    const onDrop = async (acceptedFiles: File[]) => {
        if (loading) return;
        if (!user) return;

        const files = acceptedFiles;
        if (files.length === 0) return;

        try {
            for (const file of files) {
                setUploadingFile(file);
                setLoading(true);
                setProgress(0);
                await uploadPost(file);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
            setProgress(0);
            setUploadingFile(null);
        }
    };

    const uploadPost = async (selectedFile: File) => {
        if (loading) return;
        if (!user) return;

        const docRef = await addDoc(collection(db, "users", user.id, "files"), {
            userId: user.id,
            filename: selectedFile.name,
            fullName: user.fullName,
            profileImg: user.imageUrl,
            timestamp: serverTimestamp(),
            type: selectedFile.type,
            size: selectedFile.size,
        });

        const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);

        const uploadTask = uploadBytesResumable(imageRef, selectedFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Error uploading file:", error);
            },
            async () => {
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
                    downloadURL: downloadURL,
                });
            }
        );

        await uploadTask;
    };

    return (
        <>
            <Dropzone onDrop={onDrop} minSize={0} maxSize={maxSize}>
                {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragReject,
                    fileRejections,
                }) => {
                    const isFileTooLarge =
                        fileRejections.length > 0 &&
                        fileRejections[0].file.size > maxSize;

                    return (
                        <section className="m-4">
                            <div
                                {...getRootProps()}
                                className={`h-52 w-full rounded-lg border-2 border-dashed p-5 ${
                                    isDragActive
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-600"
                                        : isDragReject
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-600"
                                        : "border-gray-300 dark:border-gray-700"
                                }`}
                            >
                                <div className="flex h-full w-full items-center justify-center">
                                    <input {...getInputProps()} />
                                    {!isDragActive && "Click here or drop a file to upload!"}
                                    {isDragActive && !isDragReject && "Drop to upload this file!"}
                                    {isDragReject && "File type not accepted, sorry!"}
                                    {isFileTooLarge && (
                                        <div className="text-red-500 mt-2">
                                            File is too large (max 50MB)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    );
                }}
            </Dropzone>

            <Dialog open={loading} onOpenChange={(open) => !open && setLoading(false)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Uploading File</DialogTitle>
                        <DialogDescription>
                            {uploadingFile && (
                                <div className="flex items-center space-x-4 py-2">
                                    <div className="w-10">
                                        <FileIcon
                                            extension={uploadingFile.name.split('.').pop() || ''}
                                            // @ts-ignore
                                            {...defaultStyles[uploadingFile.name.split('.').pop() || '']}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {uploadingFile.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {prettyBytes(uploadingFile.size)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Uploading...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DropzoneComponent;
