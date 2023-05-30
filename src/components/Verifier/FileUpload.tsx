import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import Button from '../Button'
import Card from '../Card'
import Heading from '../Heading'
import Label from '../Label'
import { LoadingCard } from '../Loading'
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
      <div
        {...getRootProps()}
        className={clsx(styles.uploadBody, {
          [styles.uploadBodyLoading]: isLoading,
        })}
      >
        <input {...getInputProps()} type="file" />
        {metadataMissing && (
          <Message type="danger" className={styles.uploadError}>
            Metadata files missing! Please add contract metadata.json
          </Message>
        )}

        <div className={styles.uploadZone}>
          <span className={styles.uploadPropose}>Drag and drop here</span> or
          <span className={styles.uploadBrowse}>Browse Files</span>
        </div>

        {isLoading && <LoadingCard className={styles.uploadLoader} />}
      </div>

      {!!displayFiles.length && (
        <div className={styles.uploadHeader}>
          <Heading size="md">
            Added Files{' '}
            <Label className={styles.uploadTag}>{displayFiles.length}</Label>
          </Heading>
          <ul className={styles.uploadList}>{displayFiles}</ul>
        </div>
      )}
    </Card>
  )
}

export default FileUpload
