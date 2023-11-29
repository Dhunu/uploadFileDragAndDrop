"use client";

import { db, storage } from "@/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";

const DropzoneComponent = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { isLoaded, isSignedIn, user } = useUser();

    // max size of 20MB accepted
    const maxSize = 20971520;

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = async () => {
                await uploadPost(file);
            };
            reader.readAsArrayBuffer(file);

            reader.onabort = () => toast.error("file reading was aborted");
            reader.onerror = () => toast.error("file reading has failed");
        });
    };

    const uploadPost = async (selectedFile: File) => {
        if (loading) return;
        if (!user) return;

        setLoading(true);
        const toastId = toast.loading("Uploading file...");

        const docRef = await addDoc(collection(db, "users", user.id, "files"), {
            userId: user.id,
            filename: selectedFile.name,
            fullName: user.fullName,
            profileImage: user.imageUrl,
            timestamp: serverTimestamp(),
            type: selectedFile.type,
            size: selectedFile.size,
        });

        const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);
        await uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
                downloadURL: downloadURL,
            });
        });

        toast.success("File uploaded successfully!", { id: toastId });
        setLoading(false);
    };

    return (
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
                    <section>
                        <div
                            {...getRootProps()}
                            className={cn(
                                "mt-10 hover:cursor-pointer mx-10 lg:mx-auto max-w-3xl h-52 flex justify-center items-center p-5 border border-dashed border-slate-400 rounded-lg text-center",
                                isDragActive
                                    ? "bg-slate-300 text-slate-800 dark:bg-slate-800 dark:text-white animate-pulse"
                                    : "dark:bg-slate-900 text-slate-400"
                            )}
                        >
                            <input {...getInputProps()} />
                            {!isDragActive &&
                                "Click here or drop a file to upload!"}
                            {isDragActive &&
                                !isDragReject &&
                                "Drop to upload this file!"}
                            {isDragReject && "File type not accepted, sorry!"}
                            {isFileTooLarge && (
                                <div className="text-red-500 mt-2">
                                    File is too large
                                </div>
                            )}
                        </div>
                    </section>
                );
            }}
        </Dropzone>
    );
};

export default DropzoneComponent;
