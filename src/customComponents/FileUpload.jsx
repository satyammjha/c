import React, { useState } from "react";
import { FileUpload } from "../components/ui/file-upload";

export default function FileUploadDemo() {
    const [files, setFiles] = useState([]);

    const handleFileUpload = (files) => {
        setFiles(files);
        console.log(files);
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-8">

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    📄 Upload Your Resume
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Let AI work its magic! We support PDF, DOCX, and TXT formats.
                </p>
            </div>


            <div className="flex flex-col items-center justify-center h-full">
                <FileUpload onChange={handleFileUpload} />

                {files.length > 0 && (
                    <div className="mt-6 w-full">
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Selected Files:
                        </h3>
                        <div className="grid gap-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                                >
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {(file.size / 1024).toFixed(1)}KB
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {files.length === 0 && (
                    <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                        Drag & drop or click to browse
                    </p>
                )}
            </div>
        </div>
    );
}