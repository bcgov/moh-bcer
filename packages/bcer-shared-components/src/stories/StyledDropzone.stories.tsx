import React, { useState } from "react"
import { StyledDropzone } from "@/components/fields/StyledDropzone"
import { StyledButton } from "@/components/buttons"


export default { title: 'Mui Styled dropzone' }

export const Dropzone = () => {

  const [dialogFileState, setFileState] = useState<{file: File | [], fileUploaded: boolean}>({
    file: [],
    fileUploaded: false,
  })


  const handleFileUpload = (file: any[]) => {
    if (file.length) {
      console.log('uploading',file[0])
      file.length ? setFileState({ file: file[0], fileUploaded: true }) : null;

    }
  }

  return (
    <div>
        <StyledDropzone
          actionText={'Drop your product report here'}
          fileUploaded={!!dialogFileState.fileUploaded}
          uploadCallbackHandler={handleFileUpload}
        />
        <StyledButton variant="contained" onClick={() => {window.alert(dialogFileState.file)}}> Read file </StyledButton>
    </div>
  )
}
