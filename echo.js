import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


Pusher.logToConsole = true;
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'ae9de5a6fd45a39bdd0e',
    cluster: 'mt1',
    forceTLS: true,
});

export default echo;
