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
  'alphanum-checksum': `This technique is used to guarantee the integrity of a file, or a request.
This checksum always takes an input string and returns a single alphanumeric character.

To compute a checksum, we first define the ${em('valid characters sequence')} as the numbers between 0 and 9, in increasing order, followed by the 26 letters of the alphabet, in lowercase, in alphabetic order.
All other characters are ignored.

In order to compute the checksum of a string, we start by defining the checksum of a valid character as itself.
Each subsequent character of the input string moves the checksum result along the ${em('valid characters sequence')} according to that character value in that sequence.
If we reach the end of the sequence, we restart at 0.

For example:
- the checksum of ${em('101')} is ${em('2')}. (we start with 1, 0 has no effect, and 1 increases the result by 1)
- the checksum of ${em('ez')} is ${em('d')}`,
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