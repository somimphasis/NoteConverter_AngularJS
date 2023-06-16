using System;

namespace Xerox.Wnc.Interfaces
{
    public enum ApprovalStatusType
    {
        Pending = 0,
        Approved = 1,
        GenericError = 2,
        NoPagesToConvert = 3,
        MaxNumberOfPagesExceeded = 4,
        ConverterUnavailable = 5,
        OCRError = 6
    }

    public class DocumentMetadata
    {
        public const string DocxFormat = "DOCX";
        public const string TxtFormat = "TXT";
        public const string PdfFormat = "PDF";
        public const string PngZipFormat = "ZIP";

        public string Filename { get; set; }
        public string Title { get; set; }
        public string OutputFilename { get; set; }
        public string OriginalFilename { get; set; }
        public string ImageZipFilename { get; set; }
        public string DownloadURL { get; set; }
        public string LocalizedLanguage { get; set; }
        public int TimeZoneOffsetMinutes { get; set; }
        public ApprovalStatusType ApprovalStatus { get; set; } = ApprovalStatusType.Pending;
        public int NumberOfCredits { get; set; } = 0;
        public string AppId { get; set; }
        public string DeviceId { get; set; }
        public string DeveloperId { get; set; }
        public string GalleryServerRoot { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public int DownloadCount { get; set; } = 0;
        public string Format { get; set; } = DocxFormat;
        public string ArchivalFormat { get; set; } = PdfFormat;
        public bool DeductCredits { get; set; } = true;
    }
}
