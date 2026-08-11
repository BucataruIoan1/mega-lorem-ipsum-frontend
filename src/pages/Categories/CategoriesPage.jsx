import EntityManagementPage from '../../components/EntityManagement/components/EntityManagementPage.jsx'

function CategoriesPage() {
  return (
    <EntityManagementPage
      entityKey="categories"
      entityLabel="Category"
      pageTitle="Record Categories"
      pageDescription="Labels used to classify records. Add, rename or remove them at any time."
      createDescription="Category names must be unique and at least 2 characters long."
      manageButtonLabel="New Category"
      emptyTitle="Nu exista categorii"
      emptyDescription="Adauga prima categorie pentru a clasifica inregistrarile."
    />
  )
}

export default CategoriesPage
