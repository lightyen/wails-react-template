package features

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"io"

	"github.com/gin-gonic/gin"
)

type Calc struct {
	ctx context.Context
}

func NewCalc() Feature {
	return &Calc{}
}

func (c *Calc) OnStartup(ctx context.Context) {
	c.ctx = ctx
}

func (c *Calc) OnShutdown(ctx context.Context) {
	//
}

func (c *Calc) Routes(ctx context.Context, e *gin.Engine) {
	//
}

func (c *Calc) MD5(value string) string {
	h := md5.New()
	_, err := io.WriteString(h, value)
	if value == "" || err != nil {
		return ""
	}
	return hex.EncodeToString(h.Sum(nil))
}
