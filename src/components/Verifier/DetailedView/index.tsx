import clsx from 'clsx'
import styles from '../Verifier.module.scss'
import { SendableContract } from '../types'
import Code from '@/components/Code'
import Details from '@/components/Details'
import Heading from '@/components/Heading'
import Message from '@/components/Message'

type DetailedViewProps = {
  checkedContract: SendableContract
  className?: string
}
const DetailedView = ({ checkedContract, className }: DetailedViewProps) => {
  const { files } = checkedContract
  const foundCount = files.found.length
  const missingCount = Object.keys(files.missing).length
  const invalidCount = Object.keys(files.invalid).length
  const totalFilesCount = foundCount + missingCount + invalidCount

  if (missingCount > 0) {
    return (
      <Details
        title={`Missing ${missingCount} of ${totalFilesCount} files`}
        className={clsx(styles.viewDetails, className)}
      >
        <Message type="danger">
          Unable to find or retrieve the required source files below.
        </Message>
        <ul className={styles.filesList}>
          {Object.keys(files.missing).map((filePath, i) => (
            <li className={styles.filesItem} key={`${filePath}-${i}`}>
              <Details title={filePath}>
                <Heading size="xs">Expected keccak256 hash:</Heading>
                <Code>{files.missing[filePath].keccak256}</Code>
                <Heading size="xs">File URLs:</Heading>
                <ul className={styles.filesList}>
                  {files.missing[filePath].urls.map((url, i) => (
                    <li className={styles.filesItem} key={`${url}-${i}`}>
                      <Code>{url}</Code>
                    </li>
                  ))}
                </ul>
              </Details>
            </li>
          ))}
        </ul>
      </Details>
    )
  }

  if (invalidCount > 0) {
    return (
      <div className="mt-2 ml-4">
        <h3 className="font-bold text-lg">
          Invalid ({invalidCount}/{totalFilesCount})
        </h3>
        <ul>
          {Object.keys(files.invalid).map((filePath, i) => (
            <li key={`${filePath}-${i}`}>
              <span className="align-middle">{filePath}</span>
              <div className="ml-8">
                <p>{files.invalid[filePath].msg}</p>
                <h4 className="font-bold">Expected keccak256 hash:</h4>
                <p>{files.invalid[filePath].expectedHash}</p>
                <h4 className="font-bold">
                  Calculated source content hash in the metadata:
                </h4>
                <p>{files.invalid[filePath].calculatedHash}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (files.found.length > 0) {
    return (
      <Details
        title={`Found ${files.found.length} of ${totalFilesCount}`}
        className={clsx(styles.viewDetails, className)}
      >
        <ul className={styles.filesList}>
          {files.found.map((file, i) => (
            <li className={styles.filesItem} key={`${file}-${i}`}>
              <Code>{file}</Code>
            </li>
          ))}
        </ul>
      </Details>
    )
  }

  return null
}

export default DetailedView
