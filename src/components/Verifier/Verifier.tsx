import { useCallback, useEffect, useState } from 'react'
import bytes from 'bytes'
import Grid from '../Grid'
import Message from '../Message'
import CheckedContractsView from './CheckedContractsView'
import FileUpload from './FileUpload'
import {
  ADD_FILES_URL,
  RESTART_SESSION_URL,
  SESSION_DATA_URL,
  VERIFY_VALIDATED_URL,
} from './constants'
import {
  DropzoneFile,
  IGenericError,
  SendableContract,
  SessionResponse,
  VerificationInput,
} from './types'
import styles from './Verifier.module.scss'

const UI_MAX_FILE_SIZE = 30 * 1024 * 1024

const Verifier: React.FC = () => {
  const [addedFiles, setAddedFiles] = useState<string[]>([])
  const [unusedFiles, setUnusedFiles] = useState<string[]>([])
  const [checkedContracts, setCheckedContracts] = useState<SendableContract[]>(
    []
  )
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let lastTarget: EventTarget | null = null

    const onDragEnter = (e: MouseEvent) => {
      lastTarget = e.target
      document.documentElement.classList.add(styles.dragOver)
    }

    const onDragLeave = (e: MouseEvent) => {
      if (e.target === lastTarget || e.target === document) {
        e.preventDefault()

        document.documentElement.classList.remove(styles.dragOver)
      }
    }

    addEventListener('dragenter', onDragEnter)
    addEventListener('dragleave', onDragLeave)
    addEventListener('drop', onDragLeave)

    return () => {
      removeEventListener('dragenter', onDragEnter)
      removeEventListener('dragleave', onDragLeave)
      removeEventListener('drop', onDragLeave)
    }
  })

  const fetchAndUpdate = useCallback(
    async (URL: string, fetchOptions?: RequestInit) => {
      try {
        const rawRes: Response = await fetch(URL, {
          credentials: 'omit',
          method: fetchOptions?.method || 'GET', // default GET
          // mode: "cors",
          ...fetchOptions,
        })

        if (!rawRes.ok) {
          const err: IGenericError = await rawRes.json()
          throw new Error(err.error)
        }
        const res: SessionResponse = await rawRes.json()
        setUnusedFiles([...res.unused])
        setCheckedContracts([...res.contracts])
        setAddedFiles([...res.files])
        setErrorMessage('')
        return res
      } catch (e: any) {
        console.log(e)

        setErrorMessage(e?.message)
      }
    },
    [setErrorMessage]
  )

  const handleFiles = async (files: DropzoneFile[]) => {
    // const handleeFiles = async (files: DropzoneFile[]) => {
    const jsonBody: any = { files: {} }
    for (const file of files) {
      if (file.size > UI_MAX_FILE_SIZE) {
        const humanReadableSize = bytes(file.size)
        return setErrorMessage(
          `Added file ${
            file.name
          } is ${humanReadableSize} which is more than the maximum single file size of ${bytes(
            UI_MAX_FILE_SIZE
          )}`
        )
      }
      let filePath = file.path
      // remove absolute path
      if (file.path.startsWith('/')) filePath = file.path.substring(1)
      // If a zip, send a seperate request, since there's already no file path
      if (
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed'
      ) {
        const formData = new FormData()
        formData.append('files', file)
        await fetchAndUpdate(ADD_FILES_URL, {
          method: 'POST',
          body: formData,
        })
      } else {
        jsonBody.files[filePath] = await file.text()
      }
    }
    if (Object.keys(jsonBody.files).length > 0) {
      await fetchAndUpdate(ADD_FILES_URL, {
        method: 'POST',
        body: JSON.stringify(jsonBody),
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const restartSession = async () => {
    await fetch(RESTART_SESSION_URL, {
      credentials: 'omit',
      method: 'POST',
    })
    setUnusedFiles([])
    setCheckedContracts([])
    setAddedFiles([])
    return
  }

  /**
   * Function to submit a validated contract to verification with chainId and address.
   *
   * @param sendable -
   */
  const verifyCheckedContract = async (sendable: VerificationInput) => {
    console.log('Verifying checkedContract ' + sendable.verificationId)
    return fetchAndUpdate(VERIFY_VALIDATED_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contracts: [sendable],
      }),
    })
  }

  useEffect(() => {
    fetchAndUpdate(SESSION_DATA_URL)
  }, [fetchAndUpdate])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Message type="info">
          Verify smart contracts by recompiling with the Solidity source code
          and metadata.
        </Message>
        <Message type="warn">
          Once a contract is verified it can&apos;t be removed from the Sourcify
          repository.
        </Message>
      </div>
      <Grid className={styles.body}>
        <FileUpload
          handleFilesAdded={handleFiles}
          addedFiles={addedFiles}
          metadataMissing={unusedFiles.length > 0 && !checkedContracts.length}
          restartSession={restartSession}
        />

        {!!checkedContracts.length && (
          <CheckedContractsView
            checkedContracts={checkedContracts}
            verifyCheckedContract={verifyCheckedContract}
          />
        )}
      </Grid>

      {!!errorMessage && <Message type="danger">{errorMessage}</Message>}
    </div>
  )
}

export default Verifier
