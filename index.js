const server= require('./server')
const port=3000
const run=async()=>{
await server.listen(port,()=>console.log(`Server is running on http://localhost:${port}`))
}
run()