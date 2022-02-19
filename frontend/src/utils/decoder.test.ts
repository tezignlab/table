import Decoder from "./decoder";

test('decode html', async () => {
  const decodedHtml = Decoder.decodeHTMLText('Hello&nbsp;World')
  expect(decodedHtml).toEqual('Hello World');
});