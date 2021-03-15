import { SampleData } from "."
import { em } from "../../utils"

export const useless:{[name:string]:string}[] = [
  {'alternatives.log': `update-alternatives 2063-09-21 17:27:03: run with --install /usr/share/plymouth/themes/text.plymouth text.plymouth /usr/share/plymouth/themes/xtech2-text/xtech2-text.plymouth 50
update-alternatives 2063-10-19 16:43:49: run with --install /usr/bin/fakeroot fakeroot /usr/bin/fakeroot-sysv 50 --slave /usr/share/man/man1/fakeroot.1.gz fakeroot.1.gz /usr/share/man/man1/fakeroot-sysv.1.gz
update-alternatives 2063-10-19 16:43:49: link group fakeroot updated to point to /usr/bin/fakeroot-sysv
update-alternatives 2063-10-19 16:43:49: run with --install /usr/bin/fakeroot fakeroot /usr/bin/fakeroot-tcp 30 --slave /usr/share/man/man1/fakeroot.1.gz fakeroot.1.gz /usr/share/man/man1/fakeroot-tcp.1.gz --slave /usr/share/man/man1/faked.1.gz
update-alternatives 2063-10-19 16:43:50: run with --quiet --install /lib/cpp cpp /usr/bin/cpp 10
update-alternatives 2063-10-19 16:43:50: link group cpp updated to point to /usr/bin/cpp
update-alternatives 2063-10-19 16:43:51: run with --quiet --install /usr/bin/cc cc /usr/bin/gcc 20 --slave /usr/share/man/man1/cc.1.gz cc.1.gz /usr/share/man/man1/gcc.1.gz`},
  {'access.log':`...
2063-10-20 17:44:59 user 0247 logged in
2063-10-20 17:45:01 user 0201 logged in
2063-10-20 17:45:06 user 0985 logged in
2063-10-20 17:45:08 user 0123 logged in
2063-10-20 17:45:11 user 2607 logged in
2063-10-20 17:45:19 user 0675 logged in`},
]

export const documentation = {
  'alphanum-checksum': `This algorithm is used to guarantee the integrity of a file, or a request.
This checksum always takes an input string and returns a single alphanumeric character.

To compute a checksum, we first define the ${em('valid characters sequence')} as the numbers between 0 and 9, in increasing order, followed by the 26 letters of the alphabet, in lowercase, in alphabetic order.
All other characters are ignored.

In order to compute the checksum of a string, we start by defining the checksum of a valid character as itself.
Each subsequent character of the input string moves the checksum result along the ${em('valid characters sequence')} according to that character value in that sequence.
If we reach the end of the sequence, we restart at 0.

For example:
- the checksum of ${em('101')} is ${em('2')}. (we start with 1, 0 has no effect, and 1 increases the result by 1)
- the checksum of ${em('ez')} is ${em('d')}`,


  'charshift': `This algorithm is used to encrypt low security text documents.

In order to encrypt a string, we first define the ${em('valid characters sequence')} as the 26 lowercase letters in alphabetical order.
All other characters are ignored.

We then select a ${em('key')}, which must be an ${em('integer between 1 and 25')}.
Each valid character is then replaced by the character which is as many positions down the ${em('valid characters sequence')} as the value of the ${em('key')}.
If we reach the end of the sequence, we loop back and continue from the start.

For example:
- Using a key of ${em('5')}, the string ${em('hello world')} is encrypted as ${em('mjqqt btwqi')}

To decode a message, we use the same algorithm, but using the opposite value of the encryption key (eg. -5 if the key was 5)`,

  'ancss':`The ANCSS algorithm is used to sign short strings.

Strings are signed using a ${em('private key')}, which is made up of 8 words of 8 hexadecimal characters each.

The signature generated is always 8 characters long where the i-th character is the ${em('alphanumerical checksum')} of the i-th character of the input string and the i-th word of the key.
If the input string is less than 8 characters, or if the string character is not an alphanumeric character, then that character is ignored`,

'dss':`DSS is used to provide network storage to a system, which can be used to backup important data.
Multiple storage pods running the DSS software together form a cluster, which can be used by the target system to store or backup data.

Depending on the version installed, different capabilities are provided, such as being able to repair corrupted data.
${em('DSS Version 1')} This version is used to distribute large dataset over 2 to 6 storage pods, and does not allow recovery of data if one pod is unavailable.
${em('DSS Version 2')} is currently in development`,

'dss_v1':`${em('DSS v1 maintenance instructions')}
- All maintenance actions must be done using the dss binary provided
- To access files, a minimum of ${em('3')} healthy storage pods must be connected to the cluster
- If a pod gets disconnected from the dss cluster, it must be reconnected manually using the ${em('dss sync')} command. This command requires the correct key to be provided.
  - Each pod has its own key
  - Each key is an alphanumeric string of up to 8 characters eg. 'f011de79'
  - Each key is stored locally across two chunks
  - For the first pod of the cluster the ids of the chunks multiplied together should match the ${em('cluster id')}
  - For the second pod of the cluster the chunks should be the first and last id of the pod
  - For the third pod of the cluster the ids of the chunks multiplied together should match the ${em('cluster key')}`,
}

export function passwdGen(users:string[][], cipher:(str:string) => string=e=>e):string {
  return users.map((u,i) => (
    `${u[0]}:${cipher(u[1])}:10${(i+2).toString().padStart(2,'0')}:${(u[0] == 'admin') ? '1001:System Administrator' : '1101:User'}:/home/${u[0].toLowerCase()}`
    )).join('\n')
}

export const lastLogins = (logins:SampleData<string[]>, count = 5, date = 2.96e12):string => {
  return logins
    .sample(count)
    .map(
      (e,i) => e[0] != 'admin' ? 
        `[${new Date(date + i*2500 + Math.random()*2500).toISOString()}] ${e[0]} logged in with password ${e[1]}`
        : undefined
      )
    .filter(e => e)
    .join('\n')
}
export const files = {useless, documentation}