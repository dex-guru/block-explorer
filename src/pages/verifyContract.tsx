/* eslint-disable */
import { useState, useCallback, useEffect } from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import bytes from 'bytes'
import { Page } from '@/components'
import CheckedContractsView from '@/components/Verifier/CheckedContractsView'
import FileUpload from '@/components/Verifier/FileUpload'
import {
  ADD_FILES_URL,
  CREATE2_COMPILE_URL,
  CREATE2_VERIFY_VALIDATED_URL,
  RESTART_SESSION_URL,
  SESSION_DATA_URL,
  UI_MAX_FILE_SIZE,
  VERIFY_VALIDATED_URL,
} from '@/components/Verifier/constants'
import {
  SendableContract,
  IGenericError,
  SessionResponse,
  DropzoneFile,
  VerificationInput,
  Create2VerificationInput,
} from '@/components/Verifier/types'
import styles from './Pages.module.scss'

interface IVerifyContractProps {}

const VerifyContract: NextPage<IVerifyContractProps> = (props) => {
  const [addedFiles, setAddedFiles] = useState<string[]>([])
  const [unusedFiles, setUnusedFiles] = useState<string[]>([])
  const [checkedContracts, setCheckedContracts] = useState<SendableContract[]>(
    []
  )
  const [errorMessage, setErrorMessage] = useState('')

  const fetchAndUpdate = useCallback(
    async (URL: string, fetchOptions?: RequestInit) => {
      try {
        const rawRes: Response = await fetch(URL, {
          credentials: 'include',
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
        const ErrorMessage = ({ message }: { message: string }) => (
          <div>
            {
              // Show if there's an error message from server. Otherwise possibly CORS.
              message ? (
                message
              ) : (
                <>
                  <div>Possibly a CORS error, check the browser console.</div>
                  <div>
                    Are you on a different domain than sourcify.dev or
                    sourcify.eth? API v2 is not available except the official
                    UI. See{' '}
                    <a
                      className="font-bold"
                      href="https://docs.sourcify.dev/docs/api/#verification-api-v2---session-based"
                    >
                      docs
                    </a>{' '}
                    for details{' '}
                  </div>
                </>
              )
            }
          </div>
        )
        setErrorMessage(e?.message)
      }
    },
    [setErrorMessage]
  )
  // const handleFiles = async (files: DropzoneFile[]) => {
  //   const formData = new FormData();
  //   files.forEach((file) => formData.append("files", file));
  //   await fetchAndUpdate(ADD_FILES_URL, {
  //     method: "POST",
  //     body: formData,
  //   });
  // };
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
      credentials: 'include',
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

  /**
   * Function to submit a create2 contract to verification
   *
   * @param sendable -
   */
  const verifyCreate2CheckedContract = async (
    sendable: Create2VerificationInput
  ) => {
    console.log('Verifying create2 checkedContract ' + sendable.verificationId)
    return fetchAndUpdate(CREATE2_VERIFY_VALIDATED_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendable),
    })
  }

  /**
   * Function to compile a create2 contract
   *
   * @param sendable -
   */
  const verifyCreate2Compile = async (verificationId: string) => {
    console.log('Compiling create2 checkedContract ' + verificationId)
    return fetchAndUpdate(CREATE2_COMPILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verificationId }),
    })
  }

  useEffect(() => {
    fetchAndUpdate(SESSION_DATA_URL)
  }, [fetchAndUpdate])
  return (
    <>
      <Head>
        <title>Verify Contract</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <iframe
          src="https://sourcify.dev/#/verifier"
          className={styles.verifyContractFrame}
        />
      </Page>
    </>
  )
}

export default VerifyContract
