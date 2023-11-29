"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

const DeleteModal = () => {
    const { user } = useUser();

    const [isDeleteModalOpen, setIsDeleteModalOpen, fileId, setFileId] =
        useAppStore((state) => [
            state.isDeleteModalOpen,
            state.setIsDeleteModalOpen,
            state.fileId,
            state.setFileId,
        ]);

    async function deleteFile() {
        if (!user || !fileId) return;

        const toastId = toast.loading("Deleting file...");

        const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);

        try {
            deleteObject(fileRef).then(() => {
                deleteDoc(doc(db, "users", user.id, "files", fileId))
                    .then(() => {
                        toast.success("File deleted successfully!", {
                            id: toastId,
                        });
                    })
                    .finally(() => {
                        setIsDeleteModalOpen(false);
                    });
            });
        } catch (error) {
            toast.error("An error occured while deleting the file!", {
                id: toastId,
            });
            setIsDeleteModalOpen(false);
        }
    }
    return (
        <Dialog
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the file!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex py-3 space-x-2">
                    <Button
                        size="sm"
                        className="px-3 flex-1"
                        variant="ghost"
                        onClick={() => setIsDeleteModalOpen(false)}
                    >
                        <span className="sr-only">Cancel</span>
                        <span>Cancel</span>
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        variant="destructive"
                        className="px-3 flex-1"
                        onClick={() => deleteFile()}
                    >
                        <span className="sr-only">Delete</span>
                        <span>Delete</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteModal;
