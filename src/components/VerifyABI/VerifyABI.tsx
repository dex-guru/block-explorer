import { ChangeEventHandler, FC, useEffect, useState } from 'react'

import clsx from 'clsx'
import { isAddress } from 'viem'

import { APP_ABI_VERIFY_URL } from '@/constants'

import Card from '../Card'
import Message from '../Message'

import styles from './VerifyABI.module.scss'

export type VerifyABIProps = {
  className?: string
}

export const VerifyABI: FC<VerifyABIProps> = ({ className }) => {
  const [currentFiles, setCurrentFiles] = useState<FileList | null>(null)
  const [currentError, setCurrentError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!APP_ABI_VERIFY_URL) {
      setIsSent(false)
      setIsReady(false)
      setCurrentError('No verify endpoint declared')
      return
    }

    if (!currentFiles?.length) {
      setIsSent(false)
      setIsReady(false)
      setCurrentError('No files selected')
      return
    }

    const data = new FormData()
    const files = [...currentFiles]
    files.forEach((file) => {
      data.append('file', file)
    })

    const formData = new FormData(e.currentTarget)
    const contractAddress = formData.get('contractAddress') as string
    if (!isAddress(contractAddress)) {
      setCurrentError('Invalid address')
    }

    fetch(`${APP_ABI_VERIFY_URL}/${contractAddress}`, {
      method: 'POST',
      body: data,
    }).then((res) => {
      if (res.ok) {
        setIsSent(true)
        setIsReady(false)
        setCurrentError(null)
      } else {
        setIsSent(false)
        setIsReady(true)
      }
    })
  }

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    setCurrentFiles(e.target.files)
  }

  useEffect(() => {
    if (currentFiles?.length !== 1) {
      setIsReady(false)
      return
    }

    currentFiles[0]
      .text()
      .catch(() => {
        setIsReady(false)
      })
      .then((res) => setIsReady(!!JSON.parse(res ?? '')))
  }, [currentFiles])

  if (!APP_ABI_VERIFY_URL) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        <Message type="info">Verify smart contracts by ABI JSON.</Message>
        <Message type="warn">
          Once a contract is verified it can&apos;t be removed from the ABI JSON repository.
        </Message>
      </div>

      {!isSent && (
        <Card>
          <form
            method="post"
            encType="multipart/form-data"
            className={styles.body}
            onSubmit={handleSubmit}>
            <label className={styles.field}>
              <strong className={styles.fieldCaption}>Select ABI JSON</strong>
              {currentFiles?.length ? (
                [...currentFiles]?.map((file, idx) => (
                  <span key={idx} className={styles.fieldFile}>
                    <span className={styles.fieldFileName}>{file.name}</span>
                    <span className={styles.fieldFileSize}>
                      ({file.size.toLocaleString('en-GB', { notation: 'compact' })})
                    </span>
                  </span>
                ))
              ) : (
                <span className={styles.fieldFile}>Browse</span>
              )}
              <input
                required
                type="file"
                className={styles.fieldInput}
                onChange={handleFileSelect}
                accept="application/json"
              />
            </label>

            {isReady && (
              <>
                <label className={styles.field}>
                  <input
                    required
                    type="text"
                    name="contractAddress"
                    placeholder="Contract Address"
                    className={styles.input}
                  />
                </label>

                <button type="submit" className={styles.submit}>
                  Submit
                </button>
              </>
            )}
          </form>
        </Card>
      )}

      {isSent && (
        <Message type="success">
          API is successfully sent! Your contract will be checked soon.
        </Message>
      )}

      {!!currentError && <Message type="danger">{currentError}</Message>}
    </div>
  )
}
