import EntityManagementPage from '../../components/EntityManagement/components/EntityManagementPage.jsx'

function OwnersPage() {
  return (
    <EntityManagementPage
      entityKey="owners"
      entityLabel="Owner"
      pageTitle="Record Owners"
      pageDescription="The people a record can be assigned to. Changes are stored in the live database."
      createDescription="Names must be unique and at least 2 characters long."
      manageButtonLabel="New Owner"
      emptyTitle="Nu exista owneri"
      emptyDescription="Adauga primul owner pentru a putea asigna inregistrari."
    />
  )
}

export default OwnersPage
