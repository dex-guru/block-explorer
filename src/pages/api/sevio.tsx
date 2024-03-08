import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(`
      <html>
        <body>
          <style>html,body {margin:0; padding:0; background:transparent; text-align:center}</style>
          <script async src="https://cdn.adx.ws/scripts/loader.js"></script>
          <div class="sevioads" data-zone="7aecae46-d352-4bab-8fa2-aaf53481cdd7"></div>
          <script>
              window.sevioads = window.sevioads || [];
              var sevioads_preferences = [];
              sevioads_preferences[0] = {};
              sevioads_preferences[0].zone = "7aecae46-d352-4bab-8fa2-aaf53481cdd7";
              sevioads_preferences[0].adType = "banner";
              sevioads_preferences[0].inventoryId = "2b61ac91-467e-4230-ae17-91acd647a900";
              sevioads_preferences[0].accountId = "012bff72-4fdf-4622-8741-9ddfbdc582fe";
              sevioads.push(sevioads_preferences);
          </script>
        </body>
      </html>
`)
}

export default handler
