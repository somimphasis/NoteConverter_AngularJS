namespace Xerox.Wnc.Web.Models
{
    public class ErrorCodes
    {
        public const string InvalidFormType = nameof(InvalidFormType);
        public const string IncorrectNumberOfFiles = nameof(IncorrectNumberOfFiles);
        public const string InvalidEntitlement = nameof(InvalidEntitlement);
        public const string MissingFilename = nameof(MissingFilename);
        public const string InvalidFileType = nameof(InvalidFileType);
        public const string InvalidFile = nameof(InvalidFile);
        public const string DocumentDoesNotExist = nameof(DocumentDoesNotExist);
        public const string AdminAccountAlreadyExists = nameof(AdminAccountAlreadyExists);
        public const string MissingUsername = nameof(MissingUsername);
        public const string InvalidPassword = nameof(InvalidPassword);
        public const string MissingEntitlement = nameof(MissingEntitlement);
        public const string InvalidUsernameOrPassword = nameof(InvalidUsernameOrPassword);
        public const string MissingUserId = nameof(MissingUserId);
        public const string UsernameDoesNotExist = nameof(UsernameDoesNotExist);

        public const string StorageServiceUnavailable = nameof(StorageServiceUnavailable);
        public const string WorkflowServiceUnavailable = nameof(WorkflowServiceUnavailable);
        public const string GalleryServiceUnavailable = nameof(GalleryServiceUnavailable);
        public const string PortalServiceUnavailable = nameof(PortalServiceUnavailable);

        public const string UnexpectedError = nameof(UnexpectedError);
    }
}
