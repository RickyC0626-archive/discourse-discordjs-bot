module.exports.truncate = (str, len, placeholder) =>
{
    if(!len) len = 400;
    if(!placeholder) placeholder = "...";
    if(str.length > len) return str.substring(0, len - placeholder.length) + placeholder;
    return str;
}
