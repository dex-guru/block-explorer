import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import Button from '../Button'
import Card from '../Card'
import styles from './Verifier.module.scss'

type FileUploadProps = {
  handleFilesAdded: (files: []) => void
  restartSession: () => void
  addedFiles: string[]
  metadataMissing: boolean
  className?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  handleFilesAdded,
  restartSession,
  addedFiles,
  metadataMissing,
  className,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: any) => {
      setIsLoading(true)
      await handleFilesAdded(acceptedFiles)
      setIsLoading(false)
    },
  })

  const displayFiles = addedFiles.map((file) => {
    return (
      <li className="mb-1" key={file}>
        {file}
      </li>
    )
  })
  return (
    <Card
      title="File Add Zone"
      className={clsx(styles.upload, className)}
      header={
        <Button
          onClick={async () => {
            setIsLoading(true)
            await restartSession()
            setIsLoading(false)
          }}
          className={styles.uploadClear}
        >
          Clear Files
        </Button>
      }
    >
      <div {...getRootProps()} className={styles.uploadZone}>
        <div className="flex flex-col flex-grow border-dashed border-2 rounded-lg hover:bg-ceruleanBlue-100 border-ceruleanBlue-500 p-4 relative">
          <input {...getInputProps()} type="file" />
          {metadataMissing && (
            <div className="bg-red-100 text-red-700 text-center py-2 rounded-lg">
              <p className="inline align-middle font-medium">
                Metadata files missing!
              </p>
              <p className="text-sm">Please add contract metadata.json</p>
            </div>
          )}
          {displayFiles.length ? (
            <div>
              <h2 className="font-bold text-lg">
                Added Files{' '}
                <span className="font-normal">({displayFiles.length})</span>
              </h2>
              <ul className="flex flex-col break-all list-outside ml-4 list-disc">
                {displayFiles}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col flex-grow justify-center items-center text-center">
              <div className="mt-2">
                Drag and drop here
                <div style={{ lineHeight: '0.8em' }}> or </div>
                <span className="text-ceruleanBlue-500">browse</span>
              </div>
            </div>
          )}
          {/* Loading Overlay */}
          {isLoading && <p>Checking contracts</p>}
        </div>
      </div>
    </Card>
  )
}

export default FileUpload
