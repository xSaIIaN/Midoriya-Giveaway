const { PREFIX } = require('../../config/config.json');

module.exports = async client => {
    let totalUsers = client.guilds.cache.reduce((users, value) => users + value.memberCount, 0)
    console.log('\x1b[32m%s\x1b[0m', `$[INFO] Logged As ${client.user.tag}`)
    console.log('\x1b[32m%s\x1b[0m', `$[INFO] Prefix: ${PREFIX}`)
    console.log('\x1b[31m%s\x1b[0m', `$[INFO] Members: ${totalUsers}`)

    var activities = [
        `Bot made by Madnessik!`,  
        ], i = 0;
    setInterval(() => client.user.setActivity(`${PREFIX}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" }),15000)
}