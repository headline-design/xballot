import { ReactNode, useMemo } from 'react'

// SDN OFAC addresses
const BLOCKED_ADDRESSES: string[] = [
  '0x629e7Da20197a5429d30da36E77d06CdF796b71A',
]

export default function Blocklist({ children, pipeState }: { children: ReactNode, pipeState: any }) {
  const { account } = pipeState.myAddress
  const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
  if (blocked) {
    return (
      <div>
        <>Blocked address</>
      </div>
    )
  }
  return <>{children}</>
}
