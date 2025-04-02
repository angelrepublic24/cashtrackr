import app from "./server"
import colors from 'colors';
import 'dotenv/config';

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(colors.cyan.bold('Rest Api on port ' + port))
});