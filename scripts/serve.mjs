import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
const root=resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try {
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=resolve(join(root,pathname));
  if(file!==root&&!file.startsWith(root+sep)) {res.writeHead(403);res.end();return;}
  if((await stat(file)).isDirectory()) file=join(file,'index.html');
  const content=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});
  res.end(content);
 } catch {
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
  res.end(await readFile(join(root,'404.html')).catch(()=>Buffer.from('Run npm run build first.')));
 }
});
server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Preview: http://localhost:'+server.address().port));
