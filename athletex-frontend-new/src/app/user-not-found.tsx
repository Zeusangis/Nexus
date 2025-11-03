import IssuePage from "@/components/templates/issue-page";

const UserNotFoundPage = () => {
  return (
    <IssuePage
      title="User Not Found"
      description="The user you are looking for might have been removed, had its name changed, or is temporarily unavailable."
    />
  );
};

export default UserNotFoundPage;
