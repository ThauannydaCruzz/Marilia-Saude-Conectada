// server.js
const path = require('path');
// O README do monorepo usa Back-End/src.env (era o que a linha original carregava,
// por um detalhe do caminho). Carrega esse e também Back-End/.env, se existir.
require('dotenv').config({ path: __dirname + '.env' });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = require("./app");

const PORT = process.env.PORT_SERVER;
app.listen(PORT, () => console.log(`Server Run -> Port:${PORT}`));
