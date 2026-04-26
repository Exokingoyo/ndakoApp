/**
 * Test complet de l'API Location - NdakoApp
 * Exécuter avec: node test_location_api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:1337';
let sessionCookie = '';
let createdLocationId = null;
let vacantAptId = null;

// ─── Utilitaire HTTP ──────────────────────────────────────────────────────────
function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 1337,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(sessionCookie ? { Cookie: sessionCookie } : {})
            }
        };

        const req = http.request(options, (res) => {
            // Sauvegarder le cookie de session
            const setCookie = res.headers['set-cookie'];
            if (setCookie) {
                sessionCookie = setCookie.map(c => c.split(';')[0]).join('; ');
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function log(title, result) {
    console.log('\n' + '═'.repeat(60));
    console.log(`  ${title}`);
    console.log('═'.repeat(60));
    console.log(`  Status: ${result.status}`);
    console.log('  Body:', JSON.stringify(result.body, null, 2).split('\n').map(l => '  ' + l).join('\n'));
}

// ─── Tests ────────────────────────────────────────────────────────────────────
async function run() {
    console.log('\n🚀 Démarrage des tests API Location - NdakoApp\n');

    // ── 1. SIGNUP ──────────────────────────────────────────────────────────────
    console.log('⏳ [1/7] Inscription utilisateur test...');
    const signup = await request('POST', '/api/v1/auth', {
        name: 'testapi',
        email: 'testapi@ndako.com',
        password: 'Test1234!',
        first_name: 'Test',
        last_name: 'API',
        phone: '+243999888777',
        nationality: 'congolaise',
        birthday: '01/01/1995'
    });
    log('POST /api/v1/auth (SIGNUP)', signup);

    // ── 2. LOGIN ───────────────────────────────────────────────────────────────
    console.log('\n⏳ [2/7] Connexion...');
    const login = await request('POST', '/api/v1/auth/login', {
        email: 'testapi@ndako.com',
        password: 'Test1234!'
    });
    log('POST /api/v1/auth/login (LOGIN)', login);

    if (login.status !== 200 && login.status !== 201) {
        console.log('\n❌ Login échoué. Arrêt des tests.');
        process.exit(1);
    }
    console.log('\n✅ Session établie:', sessionCookie ? 'OUI' : 'NON');

    // ── 3. GET /me/locations (avant création) ──────────────────────────────────
    console.log('\n⏳ [3/7] GET /me/locations (liste vide attendue)...');
    const myLocsBefore = await request('GET', '/api/v1/me/locations');
    log('GET /api/v1/me/locations (avant création)', myLocsBefore);

    // ── 4. GET /appartements pour trouver un vacant ────────────────────────────
    console.log('\n⏳ [4/7] Recherche d\'un appartement vacant...');
    const apts = await request('GET', '/api/v1/appartements');
    log('GET /api/v1/appartements', { status: apts.status, body: { total: apts.body?.data?.total || 0 } });

    const aptList = apts.body?.data?.data || apts.body?.data || [];
    const vacantApt = Array.isArray(aptList) ? aptList.find(a => a.is_vacant === true) : null;

    if (vacantApt) {
        vacantAptId = vacantApt.id;
        console.log(`\n  ✅ Appartement vacant trouvé: ${vacantAptId} (${vacantApt.name})`);
    } else {
        console.log('\n  ⚠️  Aucun appartement vacant. Utilisation du premier disponible pour tester la validation.');
        vacantAptId = Array.isArray(aptList) && aptList[0] ? aptList[0].id : null;
    }

    // ── 5. POST /location (création) ───────────────────────────────────────────
    console.log('\n⏳ [5/7] Création d\'une location...');
    if (!vacantAptId) {
        console.log('  ⚠️  Aucun appartementId disponible, test de validation (sans appartementId)...');
    }
    const createLoc = await request('POST', '/api/v1/location', {
        appartementId: vacantAptId || '000000000000000000000000',
        caution: 500,
        dateStart: '2026-05-01'
    });
    log('POST /api/v1/location (CREATE)', createLoc);

    if (createLoc.status === 200 || createLoc.status === 201) {
        createdLocationId = createLoc.body?.data?.id;
        console.log('\n  ✅ Location créée avec ID:', createdLocationId);
    }

    // ── 6. GET /location/:id ───────────────────────────────────────────────────
    const testId = createdLocationId || '69e9597fe9fd16452d797f9c';
    console.log(`\n⏳ [6/7] GET /location/${testId}...`);
    const getOne = await request('GET', `/api/v1/location/${testId}`);
    log(`GET /api/v1/location/${testId}`, getOne);

    // ── 7. GET /locations (liste globale) ──────────────────────────────────────
    console.log('\n⏳ [7/7] GET /locations (liste globale)...');
    const allLocs = await request('GET', '/api/v1/locations?page=1&limit=5');
    log('GET /api/v1/locations?page=1&limit=5', {
        status: allLocs.status,
        body: {
            status: allLocs.body?.status,
            message: allLocs.body?.message,
            total: allLocs.body?.data?.total,
            page: allLocs.body?.data?.page,
            totalPages: allLocs.body?.data?.totalPages,
            count: allLocs.body?.data?.data?.length
        }
    });

    // ── RÉSUMÉ ─────────────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(60));
    console.log('  📋 RÉSUMÉ DES TESTS');
    console.log('═'.repeat(60));
    const results = [
        ['POST /auth (signup)',          signup.status === 200 || signup.status === 201 ? '✅' : (signup.body?.message?.includes('déjà') ? '⚠️  Déjà existant' : '❌')],
        ['POST /auth/login',            login.status === 200 || login.status === 201 ? '✅' : '❌'],
        ['GET  /me/locations (non auth)', myLocsBefore.status === 200 ? '✅' : '❌'],
        ['GET  /appartements',           apts.status === 200 ? '✅' : '❌'],
        ['POST /location (create)',      createLoc.status === 200 || createLoc.status === 201 ? '✅' : `⚠️  ${createLoc.status}: ${createLoc.body?.message}`],
        ['GET  /location/:id',           getOne.status === 200 ? '✅' : `⚠️  ${getOne.status}`],
        ['GET  /locations (all+pagin.)', allLocs.status === 200 ? '✅' : '❌'],
    ];
    results.forEach(([route, status]) => console.log(`  ${status}  ${route}`));
    console.log('═'.repeat(60) + '\n');
}

run().catch(err => {
    console.error('\n❌ Erreur fatale:', err.message);
    process.exit(1);
});
