import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import tailwind from "tailwind-rn";
import WebView from 'react-native-webview';

const template = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=1"/>
<style>
body {
    font-family: PingFangSC-Regular, sans-serif;
    padding: 0 0.75rem;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
body::-webkit-scrollbar {
    display: none;
}
img {
    max-width: 100%;
    height: auto;
}
video {
    max-width: 100%;
    height: auto;
}
iframe {
    max-width: 100%;
    height: auto;
}
p {
    max-width: 100%;
}
</style>
<title></title>
</head>
 
<body>
${body}
<div style="height: 20px; width: 100%;"></div>
</body> 
<script>
    const resizeObserver = new ResizeObserver(entries => window.ReactNativeWebView.postMessage('' + entries[0].target.clientHeight))
    resizeObserver.observe(document.body)
</script>
</html>
`

export function AutoHeightWebView({ html, onLoaded }: { html: string, onLoaded?: () => void }) {

    const { height } = useWindowDimensions();

    const [webviewHeight, setWebviewHeight] = React.useState(height);

    return (
        <WebView
            style={[tailwind(`w-full`), { height: webviewHeight }]}
            originWhitelist={['*']}
            source={{ html: template(html) }}
            scrollEnabled={false}
            onMessage={(event) => {
                setWebviewHeight(parseInt(event.nativeEvent.data))
                onLoaded && onLoaded()
                return;
            }}
        />
    )

}