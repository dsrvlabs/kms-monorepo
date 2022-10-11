/** ******************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************* */

// TODO use bip32-path library
export function splitPath(path: string): number[] {
  const result: number[] = [];
  const components = path.split("/");
  components.forEach((element) => {
    let number = parseInt(element, 10);
    if (Number.isNaN(number)) {
      return; // FIXME shouldn't it throws instead?
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
}

// eslint-disable-next-line no-unused-vars
export async function foreach<T, A>(
  arr: T[],
  // eslint-disable-next-line no-unused-vars
  callback: (t: T, n: number) => Promise<A>
): Promise<A[]> {
  function iterate(index: number, array: any[], result: any[]): any {
    if (index >= array.length) {
      return result;
    }
    return callback(array[index], index).then((res) => {
      result.push(res);
      return iterate(index + 1, array, result);
    });
  }
  await Promise.resolve();
  return iterate(0, arr, []);
}
