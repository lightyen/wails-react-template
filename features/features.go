package features

import (
	"context"

	"github.com/gin-gonic/gin"
)

type Feature interface {
	OnStartup(context.Context)
	OnDomReady(context.Context)
	OnShutdown(context.Context)
	SetRoutes(e *gin.Engine)
}
