import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Label from '@/components/Label'
import { LoadingCard } from '@/components/Loading'
import Message from '@/components/Message'
import styles from './Verifier.module.scss'

type FileUploadProps = {
  handleFilesAdded: (files: []) => void
  restartSession: () => void
  addedFiles: string[]
  metadataMissing: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
  handleFilesAdded,
  restartSession,
  addedFiles,
  metadataMissing,
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

  const uploaderTitle = !!displayFiles.length ? (
    <>
      Added Files{' '}
      <Label className={styles.uploadTag}>{displayFiles.length}</Label>
    </>
  ) : undefined

  const uploaderClear = !!displayFiles.length ? (
    <Button
      caption="Clear Files"
      onClick={async () => {
        setIsLoading(true)
        await restartSession()
        setIsLoading(false)
      }}
      className={styles.uploadClear}
    />
  ) : undefined

  return (
    <Card
      title={uploaderTitle}
      className={clsx(styles.upload, {
        [styles.uploadBodyLoading]: isLoading,
      })}
      header={uploaderClear}
    >
      <div
        {...getRootProps()}
        className={clsx(styles.uploadZone, {
          [styles.uploadBodyLoading]: isLoading,
        })}
      >
        <input {...getInputProps()} type="file" />

        <div className={styles.uploadZoneBody}>
          <span className={styles.uploadPropose}>
            Drag and drop files to page
          </span>{' '}
          or
          <span className={styles.uploadBrowse}>Browse Files</span>
        </div>

        {isLoading && <LoadingCard className={styles.uploadLoader} />}
      </div>

      {metadataMissing && (
        <Message type="danger" className={styles.uploadError}>
          Metadata files missing! Please add contract metadata.json
        </Message>
      )}

      {!!displayFiles.length && (
        <ul className={styles.uploadList}>{displayFiles}</ul>
      )}
    </Card>
  )
}

export default FileUpload
