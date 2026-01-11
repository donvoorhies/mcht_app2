package com.mchtapp

import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import androidx.webkit.WebViewAssetLoader
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WebViewAssetLoaderModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private var assetLoader: WebViewAssetLoader? = null
        
        fun getAssetLoader(context: ReactApplicationContext): WebViewAssetLoader {
            if (assetLoader == null) {
                assetLoader = WebViewAssetLoader.Builder()
                    .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
                    .build()
            }
            return assetLoader!!
        }
        
        fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse? {
            val context = assetLoader?.let { 
                // Get context from somewhere - will be set when module is created
                null 
            }
            return null // Will be handled by WebView component
        }
    }

    override fun getName(): String {
        return "WebViewAssetLoader"
    }

    @ReactMethod
    fun getAssetUrl(path: String): String {
        return "https://appassets.androidplatform.net/assets/$path"
    }
}
