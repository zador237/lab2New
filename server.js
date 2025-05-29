require('dotenv').config();
const express = require ('express');
const cors = require ('cors'); 
const app = express ();
port = process.env.PORT || 8000;
app.use (cors ());
const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();




app.use (express.json ());
app.use (express.urlencoded ({ extended: true }));




app.get ('./', (req, res) => {
    res.json({"message": "API Listening",
        "term": "Summer 2025", 
        "student": "Che Joseph Fuh",
    });
} );


app.post('/api/sites', (req,res) => {
    const data = req.body;
    db.addNewSite(data)
    .then((newSite) => {
        res.status(201).json(newSite);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
})
   
app.get('/api/sites', (req, res) => {
    const { page, perPage, name, region, provinceOrTerritoryName } = req.query;
 // Default to page 1 if not provided
    db.getAllSites(page, perPage, name, region, provinceOrTerritoryName)
        .then((sites) => {
            res.status(200).json(sites);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});

app.get('/api/sites/:id', (req, res) => {
        const id = req.params.id;
        db.getSiteById(id)
            .then((site) => {
                if (site) {
                    res.status(200).json(site);
                } else {
                    res.status(404).json({ error: 'Site not found' });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
});  

app.put('/api/sites/:id', (req, res) => {   
        const id = req.params.id;
        const data = req.body;
        db.updateSiteById(data, id)
            .then((result) => {
                if (result.nModified > 0) {
                    res.status(200).json({ message: 'Site updated successfully' });
                } else {
                    res.status(404).json({ error: 'Site not found' });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
});  

app.delete('/api/sites/:id', (req, res) => {
        const id = req.params.id;
        db.deleteSiteById(id)
            .then((result) => {
                if (result.deletedCount > 0) {
                    res.status(200).json({ message: 'Site deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Site not found' });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
});







db.initialize (process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(port, () => {
    console.log (`Server is running on port ${port}`);
    });
}).catch((err)=> {
    console.log(err);
})



// module.exports = serverless(app);