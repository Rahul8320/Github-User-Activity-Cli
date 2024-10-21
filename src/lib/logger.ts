import chalk from "chalk";

const figlet = require("figlet");

export class Logger {
  public static infoLog(message: string) {
    console.log(chalk.blueBright(message));
  }

  public static errorLog(message: string) {
    console.error(chalk.bold.redBright(message));
  }

  public static warnLog(message: string) {
    console.warn(chalk.yellow(message));
  }

  public static printHeader(message: string) {
    console.log(chalk.underline.bold.cyanBright(`\n ${message} \n`));
  }

  public static printSubHeader(message: string) {
    console.log(chalk.bold.italic.greenBright(` ----- ${message} ----- `));
  }

  public static printDetails(message: string) {
    console.log(chalk.whiteBright(`  - ${message}`));
  }

  public static printLogo(message: string) {
    console.log(chalk.bold.magentaBright(figlet.textSync(message)));
  }
}
