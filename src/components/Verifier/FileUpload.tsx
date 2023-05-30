import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import Button from '../Button'
import Card from '../Card'
import Heading from '../Heading'
import Label from '../Label'
import Message from '../Message'
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
      <li className={styles.uploadItem} key={file}>
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
      <div {...getRootProps()} className={styles.uploadBody}>
        <div className={styles.container}>
          <input {...getInputProps()} type="file" />
          {metadataMissing && (
            <Message type="danger" className={styles.uploadError}>
              Metadata files missing! Please add contract metadata.json
            </Message>
          )}
          {!!displayFiles.length && (
            <div className={styles.uploadHeader}>
              <Heading size="md">
                Added Files <Label>{displayFiles.length}</Label>
              </Heading>
              <ul className={styles.uploadList}>{displayFiles}</ul>
            </div>
          )}

          {!displayFiles.length && (
            <div className={styles.uploadZone}>
              Drag and drop here or
              <span className={styles.uploadBrowse}>browse</span>
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
