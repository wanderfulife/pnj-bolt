<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { auth, db } from '../../firebase'
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'
import { useNotifications } from '../../services/notificationService'

// État du réseau et de la connexion
const networkStatus = ref({
  online: navigator.onLine,
  timestamp: new Date().toISOString(),
  firebaseConnection: 'checking...',
  lastError: null,
  detailedStatus: {
    auth: 'checking...',
    firestore: 'checking...'
  },
  firebaseConfig: null,
  lastCheck: null
})

const notifications = useNotifications()

// Vérifie la connexion Firebase Auth
async function checkAuth() {
  try {
    const currentUser = auth.currentUser
    if (currentUser) {
      await currentUser.reload()
      console.log('Auth check successful with user:', currentUser.uid)
      return { status: 'connected', error: null }
    }
    console.log('Auth check successful - no user logged in')
    return { status: 'connected', error: null }
  } catch (error) {
    console.error('Auth check failed:', error)
    return {
      status: 'error',
      error: error.message || 'Auth check failed'
    }
  }
}

// Vérifie la connexion Firestore
async function checkFirestore() {
  console.log('Starting Firestore check...')
  try {
    // Test avec un document utilisateur si connecté
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await getDoc(userRef)
      console.log('Firestore check successful with user document')
    } else {
      // Test simple de lecture de collection si non connecté
      const usersRef = collection(db, 'users')
      await getDocs(usersRef)
      console.log('Firestore check successful with collection read')
    }
    return { status: 'connected', error: null }
  } catch (error) {
    console.error('Firestore check failed:', {
      code: error.code,
      name: error.name,
      message: error.message
    })
    return {
      status: 'error',
      error: error.message || 'Firestore check failed'
    }
  }
}

// Vérifie la configuration Firebase
function checkConfig() {
  return {
    apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: !!import.meta.env.VITE_FIREBASE_APP_ID
  }
}

// Vérification complète de la connexion Firebase
async function checkFirebaseConnection() {
  try {
    // Vérification de la configuration
    networkStatus.value.firebaseConfig = checkConfig()
    
    console.log('Starting Firebase connection check...')
    const [authResult, firestoreResult] = await Promise.all([
      checkAuth(),
      checkFirestore()
    ])

    // Mise à jour des statuts détaillés
    networkStatus.value.detailedStatus = {
      auth: authResult.status,
      firestore: firestoreResult.status
    }

    // Mise à jour du statut global
    if (authResult.status === 'connected' && firestoreResult.status === 'connected') {
      networkStatus.value.firebaseConnection = 'connected'
      networkStatus.value.lastError = null
      console.log('All Firebase services connected successfully')
    } else {
      networkStatus.value.firebaseConnection = 'error'
      networkStatus.value.lastError = 'Partial connection failure'
      console.error('Connection check failed:', {
        auth: authResult,
        firestore: firestoreResult
      })
    }
  } catch (error) {
    console.error('Firebase check failed:', error)
    networkStatus.value.firebaseConnection = 'error'
    networkStatus.value.lastError = `${error.name}: ${error.message}`
  } finally {
    networkStatus.value.timestamp = new Date().toISOString()
    networkStatus.value.lastCheck = new Date().toLocaleTimeString()
  }
}

// Gestion du statut de la connexion Internet
function updateOnlineStatus() {
  const wasOnline = networkStatus.value.online
  networkStatus.value.online = navigator.onLine
  networkStatus.value.timestamp = new Date().toISOString()
  
  if (navigator.onLine) {
    if (!wasOnline) {
      notifications.success('Internet connection restored')
      checkFirebaseConnection()
    }
  } else {
    notifications.error('No internet connection')
  }
}

// Configuration des écouteurs d'événements
let checkInterval
onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  checkFirebaseConnection()
  checkInterval = setInterval(checkFirebaseConnection, 30000)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
  clearInterval(checkInterval)
})
</script>

<template>
  <div class="fixed bottom-4 left-4 p-4 bg-dark-secondary rounded-lg shadow-lg z-50">
    <div class="text-sm space-y-2">
      <!-- Titre -->
      <div class="font-semibold mb-2">Network Status</div>
      
      <!-- Statut de la connexion Internet -->
      <div class="flex items-center space-x-2">
        <div class="flex items-center">
          <span class="mr-2">Online:</span>
          <span 
            class="inline-block w-2.5 h-2.5 rounded-full"
            :class="networkStatus.online ? 'bg-green-500' : 'bg-red-500'"
          ></span>
        </div>
        <span :class="networkStatus.online ? 'text-green-500' : 'text-red-500'">
          {{ networkStatus.online ? 'Yes' : 'No' }}
        </span>
      </div>
      
      <!-- Statut des services Firebase -->
      <div class="space-y-1">
        <div class="font-medium">Firebase Services:</div>
        <div class="pl-2 space-y-1">
          <!-- Auth Status -->
          <div class="flex items-center space-x-2">
            <span>Auth:</span>
            <span :class="{
              'text-green-500': networkStatus.detailedStatus.auth === 'connected',
              'text-red-500': networkStatus.detailedStatus.auth === 'error',
              'text-yellow-500': networkStatus.detailedStatus.auth === 'checking...'
            }">
              {{ networkStatus.detailedStatus.auth }}
            </span>
          </div>
          
          <!-- Firestore Status -->
          <div class="flex items-center space-x-2">
            <span>Firestore:</span>
            <span :class="{
              'text-green-500': networkStatus.detailedStatus.firestore === 'connected',
              'text-red-500': networkStatus.detailedStatus.firestore === 'error',
              'text-yellow-500': networkStatus.detailedStatus.firestore === 'checking...'
            }">
              {{ networkStatus.detailedStatus.firestore }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Configuration Firebase -->
      <div v-if="networkStatus.firebaseConfig" class="space-y-1">
        <div class="font-medium">Config Check:</div>
        <div class="pl-2 text-xs space-y-0.5">
          <div v-for="(value, key) in networkStatus.firebaseConfig" :key="key">
            {{ key }}: <span :class="value ? 'text-green-500' : 'text-red-500'">{{ value ? '✓' : '✗' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Message d'erreur -->
      <div v-if="networkStatus.lastError" class="text-xs text-red-400 break-all">
        Error: {{ networkStatus.lastError }}
      </div>
      
      <!-- Horodatage -->
      <div class="text-xs text-text-secondary">
        Last check: {{ networkStatus.lastCheck }}
      </div>
    </div>
  </div>
</template>