export class DateFormatter {
  static formatDateToCustomLocal(dateString: string): string {
    const date = new Date(dateString);

    // Options for formatting
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    // Format the time and date separately
    const timeString = new Intl.DateTimeFormat("en-US", timeOptions).format(
      date
    );
    const dateStringFormatted = new Intl.DateTimeFormat(
      "en-US",
      dateOptions
    ).format(date);

    // Combine the time and date
    return `${timeString}, ${dateStringFormatted}`;
  }
}
