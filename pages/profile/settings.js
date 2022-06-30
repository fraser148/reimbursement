import {
  Heading,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react"
import SidebarWithHeader from "../../layouts/dashboardLayout"

const Settings = () => {
  return (
    <SidebarWithHeader>
      <Heading>Settings</Heading>
      <Editable defaultValue='093473'>
        <EditablePreview />
        <EditableInput />
      </Editable>
    </SidebarWithHeader>
  )
}

export default Settings;