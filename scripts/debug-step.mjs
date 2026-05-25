import { readFileSync } from 'fs'
import initOcct from 'occt-import-js'

const occ = await initOcct()
console.log('OCC ready, API keys:', Object.keys(occ))

const stepData = readFileSync('C:/Users/chira/Downloads/mono rail 100x300.STEP')
const result = occ.ReadStepFile(new Uint8Array(stepData), null)

console.log('\nResult keys:', Object.keys(result))
console.log('success:', result.success)
console.log('meshCount:', result.meshCount)
console.log('model keys:', result.model ? Object.keys(result.model) : 'no model')

if (result.meshCount > 0) {
  const m = result.meshes[0]
  console.log('mesh[0] keys:', Object.keys(m))
} else {
  // Try different result structure
  console.log('\nFull result sample:', JSON.stringify(result).slice(0, 500))
}
