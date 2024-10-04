#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const tar = require('tar');
const moment = require('moment');

function archiverLogs(repertoireLogs) {

    const horodatage = moment().format('YYYYMMDD_HHmmss');
    const nomFichierArchive = `logs_archive_${horodatage}.tar.gz`;


    const repertoireArchives = path.join(path.dirname(repertoireLogs), "archives_logs");
    if (!fs.existsSync(repertoireArchives)) {
        fs.mkdirSync(repertoireArchives, { recursive: true });
    }


    const cheminArchive = path.join(repertoireArchives, nomFichierArchive);


    tar.c(
        {
            gzip: true,
            file: cheminArchive,
            cwd: path.dirname(repertoireLogs)
        },
        [path.basename(repertoireLogs)]
    ).then(() => {
        const fichierJournal = path.join(repertoireArchives, "journal_archives.txt");
        fs.appendFileSync(fichierJournal, `${horodatage}: Archive créée ${nomFichierArchive}\n`);

        console.log(`Logs archivés dans : ${cheminArchive}`);
        console.log(`Journal d'archive mis à jour : ${fichierJournal}`);

        // fs.rmdirSync(repertoireLogs, { recursive: true });
    }).catch(err => {
        console.error("Erreur lors de l'archivage :", err);
    });
}

if (process.argv.length !== 3) {
    console.log("Usage: node script_archivage_logs.js <repertoire-logs>");
    process.exit(1);
}

const repertoireLogs = process.argv[2];

if (!fs.existsSync(repertoireLogs) || !fs.statSync(repertoireLogs).isDirectory()) {
    console.log(`Erreur : ${repertoireLogs} n'est pas un répertoire valide`);
    process.exit(1);
}

archiverLogs(repertoireLogs);
