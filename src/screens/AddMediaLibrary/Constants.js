export const contentType = [
  {
    name: 'Video',
    path: require('../../Assets/Images/PNG/Video.png'),
  },
  {
    name: 'Audio',
    path: require('../../Assets/Images/PNG/Audio.png'),
  },
  {
    name: 'Image',
    path: require('../../Assets/Images/PNG/Image.png'),
  },
  {
    name: 'PDF',
    path: require('../../Assets/Images/PNG/pdf.png'),
  },
  {
    name: 'Doc',
    path: require('../../Assets/Images/PNG/Doc.png'),
  },
  {
    name: 'PPT',
    path: require('../../Assets/Images/PNG/ppt.png'),
  },
  {
    name: 'HTML',
    path: require('../../Assets/Images/PNG/html.png'),
  },
  {
    name: 'Text',
    path: require('../../Assets/Images/PNG/text-format.png'),
  },
  {
    name: 'RSS',
    path: require('../../Assets/Images/PNG/rss.png'),
  },
  {
    name: 'TWITTER',
    path: require('../../Assets/Images/PNG/twitter.png'),
  },
  {
    name: 'FACEBOOK',
    path: require('../../Assets/Images/PNG/facebook.png'),
  },
  {
    name: 'URL',
    path: require('../../Assets/Images/PNG/url.png'),
  },
  {
    name: 'Stream URL',
    path: require('../../Assets/Images/PNG/stream.png'),
  },
];


export const handleFilteration=(value)=>{
  const errorObj={}
if(!value.name){
  errorObj["name"]="Please Enter Value "
}
if(!value.defaultDurationInSeconds){
  errorObj["defaultDurationInSeconds"]="Please Enter Duration "
}
if(!value.tags.lenght){
  errorObj["tags"]="Please Enter Tags "
}
if(!value.html){
  errorObj["html"]="Please Enter Text "
}
if(!value.autoScrollDurationInSeconds){
  errorObj["autoScrollDurationInSeconds"]="Please Enter Scroll Duration"
}
if(!value.url){
  errorObj["url"]="Please Enter URL"
}

if(!value.autoScrollDurationInSeconds){
  errorObj["autoScrollDurationInSeconds"]="Please Enter Scroll Duration"
}
if(!value.zoomPercentForWebview){
  errorObj["zoomPercentForWebview"]="Please Enter Zoom Value"
}

return errorObj

}