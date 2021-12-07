export class NotificationReportDTO {
    success: number;
    fail: number;
    errorData: ErrorDataType[];
}

export class ErrorDataType {
    recipient: string;
    message: string;
}