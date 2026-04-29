
import app from './app.js';
import ENV from './shared/utils/env.utils.js';

const displayLogo = () => {
    console.log("\x1b[35m");
    console.log("╔═══════════════════════════════════════════════════════════════╗");
    console.log("║                                                               ║");
    console.log("║  ███████╗███╗   ██╗██╗ ██████╗ ███████╗██╗   ██╗██████╗       ║");
    console.log("║  ██╔════╝████╗  ██║██║██╔════╝ ██╔════╝██║   ██║██╔══██╗      ║");
    console.log("║  ███████╗██╔██╗ ██║██║██║  ███╗█████╗  ██║   ██║██║  ██║      ║");
    console.log("║  ╚════██║██║╚██╗██║██║██║   ██║██╔══╝  ╚██╗ ██╔╝██║  ██║      ║");
    console.log("║  ███████║██║ ╚████║██║╚██████╔╝███████╗ ╚████╔╝ ██████╔╝      ║");
    console.log("║  ╚══════╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚══════╝  ╚═══╝  ╚═════╝       ║");
    console.log("║                                                               ║");
    console.log("║              Enterprise Financial Management API             ║");
    console.log("║                         v1.0.0                                ║");
    console.log("║                                                               ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log("\x1b[0m");
};

app.listen(ENV.PORT, () => {
    displayLogo();
     app.listen(ENV.PORT, () => {
        console.log("\x1b[32m✓\x1b[0m Server running on: \x1b[36mhttp://localhost:\x1b[1m" + ENV.PORT + "\x1b[0m");
        console.log("\x1b[32m✓\x1b[0m Environment: \x1b[33m" + (ENV.NODE_ENV || "development") + "\x1b[0m");
        console.log("\x1b[32m✓\x1b[0m Api for consume: \x1b[36mhttp://localhost:" + ENV.PORT + "/api\x1b[0m");
        console.log("\x1b[32m✓\x1b[0m Swagger UI: \x1b[36mhttp://localhost:" + ENV.PORT + "/api-docs\x1b[0m");
        console.log("");
        console.log("\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");
        console.log("");
    });
});